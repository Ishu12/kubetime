package com.abhiroop.kubetime.pojo;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="_cluster")
@Getter @Setter  @ToString
public class Cluster implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4414726317754751830L;

	public Cluster() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long uuid;
	private String name;
	
	private String clustertype;
	private String endpoint;
	private Date registeredon;
	
	private String status;
	private String token;
	private String environment;
	
	@Transient
	private String errorMessage;

	
}
